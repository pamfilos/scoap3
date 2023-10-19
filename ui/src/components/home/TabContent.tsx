import React from "react";
import Link from "next/link";

import { Country, Journal } from "@/types";
import { getSearchUrl } from "@/utils/utils";

interface TabContentProps {
  data: Journal[] | Country[];
  type: "country" | "journal";
}

const TabContent: React.FC<TabContentProps> = ({ data, type }) => {
  return (
    <div className="tab-content">
      <ul>
        {data?.map((item: Journal | Country) => {
          return (
            <li key={item?.key} className="journal flex justify-between">
              <Link href={getSearchUrl({ [type]: item?.key }, true)}>
                {item?.key}
              </Link>
              <span className="badge">{item?.doc_count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TabContent;
