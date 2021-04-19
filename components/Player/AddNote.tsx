type Props = React.PropsWithChildren<{
  userId: number | undefined;
  category: string;
  content: string;
}>;

const AddNote: React.FC<Props> = ({ userId, category, content }: Props) => {
  console.log(userId);
  console.log(category);
  console.log(content);
  return <div>hello</div>;
};

export default AddNote;
