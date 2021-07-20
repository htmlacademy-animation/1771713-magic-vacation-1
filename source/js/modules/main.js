export default () => {
    let body = document.querySelector("body");
    body.onload = () => {
        body.classList.add("page-loaded");
    };
};