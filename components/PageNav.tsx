import Icon from "components/Icon";

interface PageNavProps {
  currentPage: number;
  numPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

const PageNav: React.FunctionComponent<PageNavProps> = ({
  currentPage,
  numPages,
  onPrevPage,
  onNextPage,
  prevDisabled,
  nextDisabled,
}: PageNavProps) => {
  return (
    <div className="mt-16 mb-20 mr-20">
      <div className="flex flex-row justify-end text-sm">
        <button
          type="button"
          className={
            prevDisabled
              ? "flex flex-row items-center stroke-current text-unselected"
              : "flex flex-row items-center stroke-current text-dark"
          }
          onClick={() => onPrevPage()}
          disabled={prevDisabled}
        >
          <Icon type="back" className="mr-4" />
          <p className="">Back</p>
        </button>
        <p className="opacity-50 ml-10 mr-10">
          Page {currentPage} of {numPages}
        </p>
        <button
          type="button"
          className={
            nextDisabled
              ? "flex flex-row items-center stroke-current text-unselected"
              : "flex flex-row items-center stroke-current text-dark"
          }
          onClick={() => onNextPage()}
          disabled={nextDisabled}
        >
          <p className="">Next</p>
          <Icon type="next" className="ml-4" />
        </button>
      </div>
    </div>
  );
};

export default PageNav;
