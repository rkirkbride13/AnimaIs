const NavBar = (props: any) => {
  const renderLinks = () => {
    if (props.links.length !== 0)
      return (
        <a
          className="mx-2 font-logo text-teal-700 text-2xl"
          href={props.links[0].href}
          onClick={props.links[0].handleClick}
        >
          {props.links[0].text}
        </a>
      );
  };

  return (
    <div className="fixed top-0 navbar w-full h-fit px-3 py-2 z-50 flex justify-between items-center bg-teal-200">
      <a
        href="/"
        className="btn btn-ghost text-white text-5xl font-bold normal-case h-fit"
      >
        📚 <span className="mt-1 font-logo text-teal-700">A</span>
        <span className="mt-1 font-logo text-teal-500">nima</span>
        <span className="mt-1 font-logo text-teal-700">I</span>
        <span className="mt-1 font-logo text-teal-500">s</span>
      </a>
      {renderLinks()}
    </div>
  );
};

export default NavBar;
