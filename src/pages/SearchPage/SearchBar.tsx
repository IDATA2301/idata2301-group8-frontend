import search from '@assets/icons/search.svg'

type Props = {
  query: string;
  setQuery: (q: string) => void;
};

const SearchBar = ({ query, setQuery }: Props) => {
  return (
    <div className="search-header">
      <form
        className="search-bar-container"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="search-input"
          type="text"
          placeholder=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="search-icon-button" type="submit">
          <img className="search-icon" src={search} alt="search icon" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
