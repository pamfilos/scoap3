import React from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { Result } from "@/types";
import ResultItem from "./ResultItem";
import SearchPagination from "./SearchPagination";
import { useRouter } from "next/navigation";
import { getSearchUrl, getApiUrl } from "@/utils/utils";

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
  const router = useRouter();

  const sortOptions = [
    {
      label: "Most recent",
      value: "-publication_date",
    },
    {
      label: "Least recent",
      value: "publication_date",
    },
  ];

  const sortResults = (value: string) => {
    router.push(
      getSearchUrl({
        ...params,
        page: 1,
        ordering: value,
      })
    );
  };

  const handleDownload = async () => {
    try {
      let boom = getSearchUrl({
        ...params,
        all: true,
        format: "csv"
      })
      const export_search_url = getApiUrl()+boom;
      const response = await fetch(export_search_url, {
        responseType: 'blob'
      });

      if (!response.ok) {
        alert("error in request")
      }
      const fileBlob = new Blob([response.data], { type: response.data.type });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);

      link.download = 'scoap3-search-results.csv';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div>
      <div className="mt-4 mb-6 flex justify-center md:justify-between items-center flex-col md:flex-row">
        <p className="flex items-center md:mb-0 mb-3">
          <a onClick={()=> handleDownload()}>Found {count} results.</a>
        </p>
        <SearchPagination count={count} params={params} />
        <div className="sort flex items-center">
          {count > 0 && (
            <div>
              Sort by
              <Select
                options={sortOptions}
                className="sort-dropdown ml-3"
                onChange={sortResults}
                defaultValue="-publication_date"
              >
                <Select.OptGroup>
                  <DownOutlined />
                </Select.OptGroup>
              </Select>
            </div>
          )}
        </div>
      </div>
      <ul className="border-0 border-t border-solid border-slate-200">
        {results &&
          results?.length > 0 &&
          results?.map((article: any) => (
            <ResultItem key={article?.id} article={article} />
          ))}
      </ul>
      <div className="flex justify-center mb-7">
        <SearchPagination count={count} params={params} />
      </div>
    </div>
  );
};

export default SearchResults;
