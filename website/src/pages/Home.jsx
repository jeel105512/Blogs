// Import the React library to enable JSX syntax and use React features
import React from "react";

/**
 * Import CSS module for styling specific to this component.
 * This method scopes class names locally by default, avoiding
 * class name conflicts.
*/
import styles from "./Home.module.css";
import PageTitle from "../components/PageTitle";

import PostsIndex from "../pages/Posts/Index";
import AboutSection from "./About";
import StageringGrid from "../components/StageringGrid/StageringGrid";

// Define the Home component as a functional component
const Home = () => {
    // Return statement contains the JSX layout for the component
    return (
        /**
         * In React, a component is a logical element of HTML you want to display.
         * A return statement can only return one parent element, meaning you cannot
         * have two elements at the top of the return statement. React provides a
         * <Fragment/> element if it doesn't make sense to return a normal HTML
         * element.
         */
        <>
            <PageTitle title="Home" />
            <StageringGrid />
            <AboutSection />
            <PostsIndex title="Blogs" />
        </>
    );
};

/* Export the Home component to be used in other parts of the application */
export default Home;
