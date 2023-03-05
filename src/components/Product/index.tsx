type ProductProps = {
    name: string,
}

export const Product = ({ name }: ProductProps) => {
    return (
        <button className="text-sm font-semibold h-10 w-full transition-all bg-slate-100 hover:bg-blue-100 rounded-md flex px-4 items-center">
            {name}
        </button>
    )
}