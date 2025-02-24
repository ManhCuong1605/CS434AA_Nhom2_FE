import React from "react";
import Header from "../components/Header";
import TimKiem from "../components/TimKiem";
import Trangchu from "../pages/user/Trangchu";
import Footer from "../components/Footer";
import Slide from "../components/Slide";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Slide />
            <TimKiem />
            <Trangchu />
            <Footer />
        </>
    );
};

export default MainLayout;
