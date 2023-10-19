import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "antd";

import OrcidIcon from "../../../public/images/orcid-icon.png";
import { Affiliation, Author } from "@/types";
import { getSearchUrl } from "@/utils/utils";

interface AuthorsProps {
  authors: Author[];
  page: "search" | "detail";
  className?: string;
  affiliations?: boolean;
}

const Authors: React.FC<AuthorsProps> = ({
  authors,
  page,
  className = "",
  affiliations = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const renderAuthorsOrEtAl = (authors: Author[]) => {
    return authors?.length > 5
      ? authors.slice(0, 5).concat({ first_name: "et al" })
      : authors;
  };

  const formatAuthorName = (author: Author) => {
    const fullName =
      page === "search"
        ? [author?.last_name, author?.first_name]?.filter(Boolean)?.join(", ")
        : [author?.first_name, author?.last_name]?.filter(Boolean)?.join(" ");

    if (page === "detail") {
      return <a href={getSearchUrl({ search: fullName }, true)}>{fullName}</a>;
    }
    return fullName;
  };

  const formatAffiliations = (affiliations: Affiliation[]) => {
    return affiliations
      ?.map((aff) => aff?.value)
      ?.filter(Boolean)
      ?.join(", ");
  };

  const renderAuthorsModalButton = (authors: Author[]) => (
    <span>
      {" - "}
      <a onClick={() => setModalVisible(true)}>
        Show all {authors?.length} authors
      </a>
    </span>
  );

  return (
    <p className={`${page}-authors ${className} inline-block`}>
      {renderAuthorsOrEtAl(authors)?.map((author, index) => (
        <span key={`${author?.last_name}-${index}`}>
          {index ? "; " : ""}
          <i>{formatAuthorName(author)}</i>
          {affiliations &&
            author?.affiliations &&
            author?.affiliations?.length > 0 && (
              <>
                {" "}
                (
                <a
                  href={getSearchUrl(
                    { search: formatAffiliations(author?.affiliations) },
                    true
                  )}
                >
                  {formatAffiliations(author?.affiliations)}
                </a>
                )
              </>
            )}
          {author?.orcid && (
            <a
              href={`https://orcid.org/${author?.orcid}`}
              title={author?.orcid}
              className="inline-block h-3 ml-1"
            >
              <Image
                priority
                width="12"
                src={OrcidIcon}
                alt="Author's Orcid profile"
              />
            </a>
          )}
        </span>
      ))}

      {page === "detail" &&
        authors &&
        authors?.length > 5 &&
        renderAuthorsModalButton(authors)}

      <Modal
        title="Authors"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {authors?.map((author, index) => (
          <p key={`${author?.last_name}-${index}`}>
            {formatAuthorName(author)}
            {affiliations &&
              author?.affiliations &&
              author?.affiliations?.length > 0 &&
              ` (${formatAffiliations(author?.affiliations)})`}
          </p>
        ))}
      </Modal>
    </p>
  );
};

export default Authors;
