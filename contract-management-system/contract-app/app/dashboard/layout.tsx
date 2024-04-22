import Link from "next/link";
import "./globals.css"
import LogoutButton from './LogoutButton.client';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <div>
                    <nav className="navbar" role="navigation" aria-label="main navigation">
                        <div className="navbar-brand">
                            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>

                        <div id="navbarBasicExample" className="navbar-menu">
                            <div className="navbar-start">
                                <Link className="navbar-item" href={"/dashboard"}>
                                    Home
                                </Link>

                                <Link className="navbar-item" href={"/dashboard/workflows"}>
                                    All Workflows
                                </Link>

                                <Link className="navbar-item" href={"/dashboard/contracts"}>
                                    All Contracts
                                </Link>

                                <div className="navbar-item has-dropdown is-hoverable">
                                    <Link className="navbar-link" href={"./"}>
                                        More
                                    </Link>

                                    <div className="navbar-dropdown">
                                        <Link className="navbar-item" href={"./"}>
                                            About
                                        </Link>
                                        <Link className="navbar-item" href={"./"}>
                                            Documentation
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="navbar-end">
                                <div className="navbar-item">
                                    <Link className="navbar-item" href={"/dashboard/profile"}>
                                        Profile
                                    </Link>
                                </div>
                                <div className="navbar-item">
                                    <div className="buttons">
                                        <LogoutButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <section className="section">
                        <div className="container">
                            {children}
                        </div>
                    </section>
                </div>
            </body>
        </html>
    )
}