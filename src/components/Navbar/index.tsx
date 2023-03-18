import { NavbarProps, PostProductProps } from "../../types";
import { PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { Button, Modal, Spinner } from "flowbite-react";

import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { CONSTANTS } from "../../utils/constants";

export const Navbar = ({ onClose, onSuccess, onError }: NavbarProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostProductProps>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "engelsCurvesPost",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAboutModal, setOpenAboutModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<PostProductProps> = async (data) => {
    setIsLoading(true);

    await fetch(
      "https://classificacao-bens-api.azurewebsites.net/api/Product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 400) {
          onError();
        } else {
          onSuccess();
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false);
        onClose();
        setOpenModal(false);
      });

    console.log(data);
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 left-0 drop-shadow-lg py-3 px-3">
      <div className="container flex flex-wrap items-center justify-between mx-auto max-w-[926px]">
        <h4 className="self-center text-lg font-bold text-blue-700">
          {CONSTANTS.NAVBAR.TITLE}
        </h4>

        <div className="flex flex-row gap-4">
          <button
            className="text-blue-700 hover:text-white transition-all flex justify-center items-center gap-2 bg-white hover:bg-blue-700 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setOpenAboutModal(true)}
          >
            Sobre
          </button>
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="text-white flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <span className="md:block hidden">
              {CONSTANTS.NAVBAR.BUTTON_TITLE}
            </span>
            <PlusCircle size={16} color={"white"} />
          </button>
        </div>
      </div>

      <Modal show={openAboutModal} onClose={() => setOpenAboutModal(false)}>
        <Modal.Header> Sobre a ferramenta </Modal.Header>

        <Modal.Body>
          <p className="text-justify text-sm mt-5">
            Essa é uma ferramenta desenvolvida por alunos da UFOP para a disciplina de ENP150 - Economia com o
            intúito de ser uma aplicação didática para o entendimento da classificação de bens através da curva de Engels.
            A curva de Engels ela relaciona o bem com a renda e a quantidade consumida de acordo com a renda e de acordo com o coeficiente angular da curva,
            podemos classificar se o bem é normal/superior ou inferior.
          </p>

          <br />
          <b>Instruções de uso</b>
          <p className="text-justify text-sm mt-5">
            O painel da direita lista os produtos que foram cadastrados e para visualizar a sua curva e classificação,
            basta clicar que o gráfico será plotado do lado esquerdo.
            <br />
            <br />
            Para cadastrar um novo bem, basta clicar no botão “Novo Produto” no canto superior direito da tela.
            Informar o nome do bem, a sua matrícula e adicionar os pontos da curva. Para cada ponto a adicionar,
            basta clicar no botão adicionar para quantos pontos quiser. Após informar todos os pontos,
            clique em salvar que o produto será inserido no banco de dados e listado no grid da direita.
            Para visualizar o produto que acabou de cadastrar, basta clicar nele.
          </p>


        </Modal.Body>
      </Modal>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>{CONSTANTS.MODAL.TITLE}</Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-3 max-w-xs mb-4">
              <label htmlFor="product">{CONSTANTS.MODAL.PRODUCT_LABEL}</label>
              <input
                className="border border-blue-500 rounded-lg px-4 py-2"
                placeholder={CONSTANTS.MODAL.PRODUCT_PLACEHOLDER}
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500">Preencha este campo</span>
              )}
            </div>
            <div className="flex flex-col gap-3 max-w-xs mb-4">
              <label htmlFor="product">{CONSTANTS.MODAL.REGISTRATION_LABEL}</label>
              <input
                className="border border-blue-500 rounded-lg px-4 py-2"
                placeholder={CONSTANTS.MODAL.REGISTRATION_PLACEHOLDER}
                {...register("registration", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500">Preencha este campo</span>
              )}
            </div>

            <ul className="flex flex-col gap-4">
              <label htmlFor="product">{CONSTANTS.MODAL.CURVE_LABEL}</label>

              {fields.map((item, index) => (
                <li key={item.id} className="flex flex-wrap gap-2 mb-4">
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        placeholder={CONSTANTS.MODAL.INCOME_PLACEHOLDER}
                        className="border border-blue-500 rounded-lg px-4 py-2"
                        {...field}
                      />
                    )}
                    name={`engelsCurvesPost.${index}.income`}
                    rules={{ required: true }}
                  />

                  <Controller
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        placeholder={CONSTANTS.MODAL.AMOUNT_PLACEHOLDER}
                        className="border border-blue-500 rounded-lg px-4 py-2"
                        {...field}
                      />
                    )}
                    name={`engelsCurvesPost.${index}.amount`}
                    rules={{ required: true }}
                  />

                  <button type="button" onClick={() => remove(index)}>
                    <Trash color={"#ff6666"} size={20} />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              outline={true}
              className="mt-4"
              color="light"
              size="sm"
              type="button"
              onClick={() => append({ income: "", amount: "" })}
            >
              <span className="flex justify-center items-center gap-2">
                {CONSTANTS.MODAL.ADD_BUTTON}{" "}
                <PlusCircle size={16} color={"#333"} />
              </span>
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              {isLoading && <Spinner />}
              {!isLoading && CONSTANTS.MODAL.SUBMIT_BUTTON}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </nav>
  );
};
