import Footer from "../components/Footer"
import Navigation from "../components/Navigation"

const Main = ({ children }: any) => {
    return (
        <div>
            <Navigation />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default Main;