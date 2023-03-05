'use client'

import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { LoaderIcon } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Navbar, Product } from "@/components";
import { ApiResponseProps } from "@/types";
import { CONSTANTS } from "@/utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {

  const [dataSet, setDataSet] = useState<ApiResponseProps>();
  const [selectedData, setSelectedData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [xAxis, setXAxis] = useState<any>();
  const [yAxis, setYAxis] = useState<any>();

  const [angularCoefficients, setAngularCoefficients] = useState<any>();
  const [classifications, setClassifications] = useState<any>();

  useEffect(() => {
    getDataSet();
  }, [])

  const getDataSet = async () => {
    setIsLoading(true);
    await fetch('https://classificacao-bens-api.azurewebsites.net/api/Product')
      .then((response) => response.json())
      .then((data) => setDataSet(data))
      .finally(() => setIsLoading(false));
  };

  const selectDataSet = async (index: string) => {
    setIsLoading(true);
    await fetch(`https://classificacao-bens-api.azurewebsites.net/api/Product/${index}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedData(data);
        console.log(data);

        const xAxis = data.engelsCurvesResponse.map((elm: { amount: any; }) => elm.amount);
        const yAxis = data.engelsCurvesResponse.map((elm: { income: any; }) => elm.income);

        const angularCoefficients = data.engelsCurvesResponse.map((elm: { angularCoefficient: any; }) => elm.angularCoefficient);
        const classifications = data.engelsCurvesResponse.map((elm: { classification: any; }) => elm.classification);

        setXAxis(xAxis);
        setYAxis(yAxis);

        setAngularCoefficients(angularCoefficients);
        setClassifications(classifications);
      })
      .finally(() => setIsLoading(false));
  }

  const dataSetComplete = {
    labels: xAxis,
    datasets: [
      {
        label: selectedData?.name,
        data: yAxis,
        borderColor: 'rgb(29 78 216)',
        backgroundColor: 'rgb(147 197 253)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <main className='container mx-auto py-20 px-4'>
      <Navbar onClose={getDataSet} />

      <div className="flex lg:flex-wrap flex-wrap-reverse justify-center gap-6 text-slate-500">
        {selectedData?.engelsCurvesResponse && (
          <div className="bg-white drop-shadow-lg w-full max-w-lg py-6 px-8 flex flex-col gap-2 rounded-lg">
            <div className="flex justify-between -mb-2">
              <h1 className="md:text-xl text-md font-bold text-slate-600">
                {CONSTANTS.CHART.TITLE}
              </h1>

              <div className="w-full max-w-[100px]">
                <p className="text-xs mb-1">{CONSTANTS.CHART.LEGEND}</p>
                <p className="text-xs text-green-500 font-bold">{CONSTANTS.CHART.COEF}</p>
                <p className="text-xs text-red-500 font-bold">{CONSTANTS.CHART.CLASS}</p>
              </div>
            </div>
            {selectedData?.engelsCurvesResponse && (
              <>
                <Line
                  options={options}
                  data={dataSetComplete}
                  width={400}
                  height={400}
                />
                <div className="flex justify-between ml-10">
                  {angularCoefficients.map((e: string, i: string) => {
                    return (
                      <p key={i} className="text-xs text-green-500 font-bold">{Number(e).toFixed(2)}</p>
                    )
                  })}
                </div>
                <div className="flex justify-between ml-10">
                  {classifications.map((e: string, i: string) => {
                    return (
                      <p key={i} className="text-xs text-red-500 font-bold">{Number(e).toFixed(0)}</p>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <div className="bg-white drop-shadow-lg w-full max-w-sm py-6 px-8 flex flex-col gap-2 rounded-lg">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-xl text-md  font-bold text-slate-600">
                {CONSTANTS.PRODUCTS.TITLE}
              </h1>
              <h1 className="text-sm font-normal">
                {CONSTANTS.PRODUCTS.SUBTITLE}
              </h1>
            </div>

            {isLoading && (
              <div className="animate-spin">
                <LoaderIcon size={24} color={'#333'}/>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {!dataSet && !isLoading && (
              <div>
                <p>Sem produtos cadastrados</p>
              </div>
            )}

            {dataSet && (
              dataSet.items.map((elm, idx) => {
                return (
                  <div key={idx} onClick={() => selectDataSet(elm.id)}>
                    <Product name={elm.name} />
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}