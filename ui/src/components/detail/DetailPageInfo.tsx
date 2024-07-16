import React from "react";
import moment from "moment";
import { Divider } from "antd";

import { JournalInfo, ArticleIdentifier, License, Result } from "@/types";
import { resolveIdentifierLink } from "@/utils/utils";
import FulltextFiles from "../shared/FulltextFiles";
import PublicationInfo from "../shared/PublicationInfo";

interface DetailPageInfoProps {
  article: Result;
}

const DetailPageInfo: React.FC<DetailPageInfoProps> = ({ article }) => {
  const { artid, publisher } =
    (article?.publication_info?.[0] as JournalInfo) || {};

  const renderIdentifierLinks = (identifiers: ArticleIdentifier[]) => {
    return identifiers?.map((identifier) => (
      <div key={identifier?.identifier_type}>
        <dt>{identifier?.identifier_type}:</dt>
        {identifier?.identifier_type === "arXiv" && (
          <dd>
            {article?.article_arxiv_category?.map(
              (category) => category?.primary && category?.category
            )}
          </dd>
        )}
        <dd>
          <a href={resolveIdentifierLink(identifier)}>
            {identifier?.identifier_value}
          </a>
        </dd>
      </div>
    ));
  };

  const renderLicenses = (licenses: License[]) => {
    return licenses?.map((licence) => (
      <a href={licence?.url} key={licence?.name}>
        {licence?.name}
      </a>
    ));
  };

  const renderCopyright = () => {
    if (article?.copyright?.[0]?.statement)
      return article?.copyright?.[0]?.statement;
    else
      return article?.copyright?.[0]?.holder || "-"
  }

  return (
    <dl className="m-0 pb-5">
      <dt>Published on:</dt>
      <dd>{moment(article?.publication_date).format("DD MMMM YYYY")}</dd>
      <dt>Created on:</dt>
      <dd>{moment(article?._created_at).format("DD MMMM YYYY")}</dd>
      <dt>Publisher:</dt>
      <dd>{publisher}</dd>
      <dt>Published in:</dt>
      <dd>
        <PublicationInfo data={article?.publication_info?.[0]} page="detail" />
      </dd>
      {artid && <dd>Article ID: {artid}</dd>}
      {renderIdentifierLinks(article?.article_identifiers)}
      <dt>Copyrights:</dt>
      <dd>{renderCopyright()}</dd>
      <dt>Licence:</dt>
      <dd>{renderLicenses(article?.related_licenses)}</dd>

      <Divider />

      <dt>Fulltext files:</dt>
      <dd className="flex mt-2">
        <FulltextFiles files={article?.related_files} />
      </dd>
    </dl>
  );
};

export default DetailPageInfo;
