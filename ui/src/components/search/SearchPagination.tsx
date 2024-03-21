import React from "react";
import { Pagination } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getSearchUrl } from "@/utils/utils";
import { Params } from "@/types";

interface SearchPagination {
  count: number;
  params: Params;
}

const SearchPagination: React.FC<SearchPagination> = ({ count, params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || 1

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", `${page}`);

    router.push(pathname + (params.toString() ? `?${params.toString()}` : ''));
  };

  return (
    <Pagination
      size="small"
      pageSize={Number(params?.page_size) || 20}
      total={count}
      onChange={(page) => onPageChange(page)}
      showSizeChanger={false}
      current={Number(currentPage) || 1}
      hideOnSinglePage
      className="md:mb-0 mb-3"
    />
  );
};

export default SearchPagination;
