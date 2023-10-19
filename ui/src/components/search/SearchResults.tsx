import React from "react";

import { Result } from "@/types";
import ResultItem from "./ResultItem";
import SearchPagination from "./SearchPagination";

interface SearchResultsProps {
  results: Result[];
  count: number;
  params: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  count,
  params,
}) => {
  return (
    <div>
      <div className="mt-4 mb-6 flex justify-between align-center">
        <p className="flex items-center">Found {count} results.</p>
        <SearchPagination count={count} params={params} />
        <div className="sort flex items-center">
          {count > 0 && "Add sort here"}
        </div>
      </div>
      <ul className="border-0 border-t border-solid border-slate-200">
        {results &&
          results?.length > 0 &&
          results?.map((article: any) => (
            <ResultItem key={article?.id} article={article} />
          ))}
      </ul>
      <div className="flex justify-center">
        <SearchPagination count={count} params={params} />
      </div>
    </div>
  );
};

export default SearchResults;
