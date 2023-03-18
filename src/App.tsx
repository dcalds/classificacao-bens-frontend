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

import { Navbar, Product } from "./components";
import { ApiResponseProps } from "./types";
import { CONSTANTS } from "./utils/constants";
import { ToastContainer, toast } from "react-toastify";

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

        const orderedData = data.engelsCurvesResponse;

        const xAxis = orderedData
          .map((elm: { amount: any }) => Number(elm.amount)).reverse();
        const yAxis = orderedData
          .map((elm: { income: any }) => Number(elm.income)).reverse();

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
    labels: yAxis,
    datasets: [
      {
        label: "Quantidade X Renda",
        data: xAxis,
        borderColor: "rgb(29 78 216)",
        backgroundColor: "rgb(147 197 253)",
      },
    ],
  };

  const options = {
    indexAxis: 'y' as any,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

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
                <div className="pl-4 py-4 relative">
                  <Line
                    options={options}
                    data={dataSetComplete}
                    width={300}
                    height={300}
                  />
                  <p className="absolute text-xs font-bold top-1/2 -left-6 -translate-y-2/4 origin-bottom -rotate-90">Renda</p>
                  <p className="absolute text-xs font-bold -bottom-2 right-1/2 translate-x-2/4">Quantidade</p>
                </div>
                <br />
                <h2>
                  <b>Observações do bem {selectedData?.name}</b>
                </h2>
                <p className="text-justify text-sm mt-5">
                  {
                    selectedData?.observation.split("<br/>").map(function (item: any, idx: any) {
                      return (
                        <span key={idx}>
                          {item}
                          <br />
                        </span>
                      )
                    })
                  }

                </p>
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
                {/* <LoaderIcon size={24} color={"#333"} /> */}
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
                    <Product name={`${elm.name} - ${elm.registration}`} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
