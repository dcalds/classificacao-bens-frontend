"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { LoaderIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Navbar, Product } from "@/components";
import { ApiResponseProps } from "@/types";
import { CONSTANTS } from "@/utils/constants";
import { ToastContainer, toast } from "react-toastify";

import Chart from "react-apexcharts";

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
  }, []);

  const getDataSet = async () => {
    setIsLoading(true);
    await fetch("https://classificacao-bens-api.azurewebsites.net/api/Product")
      .then((response) => response.json())
      .then((data) => setDataSet(data))
      .finally(() => setIsLoading(false));
  };

  const selectDataSet = async (index: string) => {
    setIsLoading(true);
    await fetch(
      `https://classificacao-bens-api.azurewebsites.net/api/Product/${index}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedData(data);

        const orderedData = data.engelsCurvesResponse
          .sort(function (a: any, b: any) {
            return (Number(a.amount) - Number(b.amount));
          });

        const xAxis = orderedData
          .map((elm: { amount: any }) => Number(elm.amount));
        const yAxis = orderedData
          .map((elm: { income: any }) => Number(elm.income));

        const angularCoefficients = orderedData
          .map((elm: { angularCoefficient: any }) => elm.angularCoefficient)
          .reverse();
        const classifications = orderedData
          .map((elm: { classification: any }) => elm.classification)
          .reverse();

        setXAxis(xAxis);
        setYAxis(yAxis);

        setAngularCoefficients(angularCoefficients);
        setClassifications(classifications);
      })
      .finally(() => setIsLoading(false));
  };

  const errorToast = () =>
    toast.error("Erro ao criar produto", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const successToast = () =>
    toast.success("Produto Criado", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const dataSetComplete = {
    labels: xAxis,
    datasets: [
      {
        label: "Coeficiente Angular: ",
        data: yAxis,
        borderColor: "rgb(29 78 216)",
        backgroundColor: "rgb(147 197 253)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const config = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: xAxis,
    },
    stroke: {
      show: true,
      curve: 'smooth',
    },
  };

  const series = [
    {
      name: "series-1",
      data: yAxis,
    }
  ];

  return (
    <main className="container mx-auto py-20 px-4">
      <Navbar onClose={getDataSet} onSuccess={successToast} onError={errorToast} />

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex lg:flex-wrap flex-wrap-reverse justify-center gap-6 text-slate-500">
        {selectedData?.engelsCurvesResponse && (
          <div className="bg-white drop-shadow-lg w-full max-w-lg py-6 px-8 flex flex-col gap-2 rounded-lg">
            <div className="flex justify-between">
              <h1 className="md:text-xl text-md font-bold text-slate-600">
                {CONSTANTS.CHART.TITLE}
              </h1>
            </div>
            {selectedData?.engelsCurvesResponse && (
              <>
                {/* <Line
                  options={options}
                  data={dataSetComplete}
                  width={400}
                  height={400}
                /> */}
                <Chart
                  options={config}
                  series={series}
                  type="line"
                  width="400"
                  height="400"
                />
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
                <LoaderIcon size={24} color={"#333"} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {!dataSet && !isLoading && (
              <div>
                <p>Sem produtos cadastrados</p>
              </div>
            )}

            {dataSet &&
              dataSet.items.map((elm, idx) => {
                return (
                  <div key={idx} onClick={() => selectDataSet(elm.id)}>
                    <Product name={elm.name} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
