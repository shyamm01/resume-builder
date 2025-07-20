import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Footer = (props: Props) => {
  return (
    <footer className="bg-blue-800 dark:bg-gray-900 text-white dark:text-gray-300 text-center py-6 mt-auto transition-colors duration-300">
      {props.children}
      <p className="text-sm">
        &copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
