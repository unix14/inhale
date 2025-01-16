const Footer = () => {
  return (
    <div className="fixed bottom-4 left-0 right-0 text-center">
      <a
        href="https://github.com/unix14"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white text-sm hover:text-breathing-accent relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
      >
        Eyal Yaakobi
      </a>
    </div>
  );
};

export default Footer;