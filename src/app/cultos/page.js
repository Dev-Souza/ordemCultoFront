'use client';

import React from "react";
import HeaderComponent from "../components/cultos/HeaderComponent";
import MainWindowComponent from "../components/cultos/MainWindowComponent";

export default function Page() {
    return (
        <>
            <HeaderComponent caminho="login" />
            <MainWindowComponent />
        </>
    );
}