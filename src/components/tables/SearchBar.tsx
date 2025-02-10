interface SearchInputsProps {
  searchTableNumber: string
  setSearchTableNumber: (value: string) => void
  searchOrderNumber: string
  setSearchOrderNumber: (value: string) => void
}

export const SearchInputs = ({
  searchTableNumber,
  setSearchTableNumber,
  searchOrderNumber,
  setSearchOrderNumber,
}: SearchInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <input
        type="text"
        placeholder="Mesa"
        value={searchTableNumber}
        onChange={(e) => setSearchTableNumber(e.target.value)}
        className="bg-black/50 border border-zinc-800 rounded-md px-4 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
      />
      <input
        type="text"
        placeholder="Comanda"
        value={searchOrderNumber}
        onChange={(e) => setSearchOrderNumber(e.target.value)}
        className="bg-black/50 border border-zinc-800 rounded-md px-4 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
      />
    </div>
  )
}
