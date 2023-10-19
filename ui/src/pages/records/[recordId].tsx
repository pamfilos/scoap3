import React from "react";
import ReactHtmlParser from "react-html-parser";
import { GetServerSideProps } from "next";

import { Result } from "@/types";
import Authors from "@/components/shared/Authors";
import DetailPageInfo from "@/components/detail/DetailPageInfo";
import { authToken, getApiUrl } from "@/utils/utils";

interface RecordPageProps {
  article: Result;
}

const RecordPage: React.FC<RecordPageProps> = ({ article }) => {
  return (
    <div className="container">
      <div className="container-inner detail-page lg:flex">
        <div className="detail-page-main">
          <h2 className="font-normal mb-3">
            {ReactHtmlParser(article?.title)}
          </h2>
          <Authors
            authors={article?.authors}
            page="detail"
            affiliations
            className="mb-3"
          />
          <p className="text-justify leading-relaxed">
            {ReactHtmlParser(article?.abstract)}
          </p>
        </div>
        <div className="detail-page-right">
          <DetailPageInfo article={article} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const recordId = context.query["recordId"];

  const res = await fetch(getApiUrl() + `/${recordId}`, authToken);
  const article = (await res.json()) as Result;

  return { props: { article } };
};

export default RecordPage;
