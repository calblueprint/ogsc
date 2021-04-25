import { ProfileFieldKey } from "@prisma/client";
import labelProfileField from "utils/labelProfileField";

type Props = React.PropsWithChildren<{
  fieldKey: ProfileFieldKey;
}>;

const LargeFieldCellLayout: React.FC<Props> = ({
  fieldKey,
  children,
}: Props) => {
  return (
    <div className="mb-10">
      <h2 className="text-dark text-lg font-semibold my-5">
        {labelProfileField(fieldKey)}
      </h2>
      {children}
    </div>
  );
};

export default LargeFieldCellLayout;
