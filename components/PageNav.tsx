import Icon from "components/Icon";

interface PageNavProps {
  currentPage: number;
  numPages: number;
  prevPage: () => void;
  nextPage: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

const PageNav: React.FunctionComponent<PageNavProps> = ({
  currentPage,
  numPages,
  prevPage,
  nextPage,
  prevDisabled,
  nextDisabled,
}: PageNavProps) => {
  return (
    <div>
      <div className="flex flex-row">
        <button
          type="button"
          className="flex flex-row mx-5 mt-5"
          onClick={() => prevPage()}
          disabled={prevDisabled}
        >
          <Icon type="back" className="w-6 mx-5 mt-5 text-unselected" />
          <p>Back</p>
        </button>
        <p className="mx-5 mt-5">
          Page {currentPage} of {numPages}
        </p>
        <button
          type="button"
          className="flex flex-row mx-5 mt-5"
          onClick={() => nextPage()}
          disabled={nextDisabled}
        >
          <p>Next</p>
          <Icon type="next" className="w-6 mx-5 mt-5 text-unselected" />
        </button>
      </div>
    </div>
  );
};

export default PageNav;
