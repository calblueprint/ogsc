import React from "react";

type Props = {
  children: React.ReactNode;
};

const SignUpLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div>
      <div className="fixed top-0 flex flex-col justify-between w-64 h-screen bg-blue-muted" />
      <div className="w-1/6 ml-64 pl-20 pt-5 flex justify-center">
        <img src="/logo.png" alt="Oakland Genesis Soccer Club logo" />
      </div>
      <div className="ml-64 pl-20">{children}</div>
      <div className="w-1/6 ml-64 pl-20 pb-20 flex justify-center">
        <a
          href="https://vercel.com?utm_source=calblueprint&utm_campaign=oss"
          // eslint-disable-next-line react/jsx-no-target-blank
          target="_blank"
        >
          <img
            width="170px"
            src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
            alt="Powered By Vercel"
          />
        </a>
      </div>
    </div>
  );
};

export default SignUpLayout;
