export type ApiResponseProps = {
    pageIndex: string;
    rowsCount: string;
    items: EngelsCurvesResponseProps[];
};

export type EngelsCurvesResponseProps = {
    id: string,
    name: string,
    registration: string,
    engelsCurvesResponse: ProductProps[]
}

export type ProductProps = {
    id: string,
    productId: string,
    income: string,
    amount: string,
    angularCoefficient: string,
    classification: string
}

export type EngelsCurvesPostProps = {
    income: string,
    amount: string,
}

export type PostProductProps = {
    name: string,
    registration: string,
    engelsCurvesPost: EngelsCurvesPostProps[]
}