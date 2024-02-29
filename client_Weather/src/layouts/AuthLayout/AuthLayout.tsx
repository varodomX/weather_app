import Font from "@/components/Font"
import Header from "@/components/Signin/Header"

function Layout(props : any) {
    return (
        <>
            <Font />
            <Header />
            {props.children}
        </>
    )
}

export default Layout