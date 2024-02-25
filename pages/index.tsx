import type { NextPage } from "next";
import Navbar from "../app/components/Navbar";
import Content from "../app/components/Content";

import "../styles/globals.css";

const Home: NextPage = () => {
    return (
        <>
            <Navbar />
            <Content />
        </>
    );
};

export default Home;
