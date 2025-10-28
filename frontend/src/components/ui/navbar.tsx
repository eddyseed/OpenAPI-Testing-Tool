import { COLORS } from '@/config/appConfig';
import React from 'react';
import Button from './button';

const Navbar01: React.FC = () => {
    return (
        <nav className={`w-full z-20 top-0 start-0 border-b`} style={{ backgroundColor: COLORS.primary }}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/favicon-16x16.png" className="h-8" alt="Website Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">OpenAPI Tool</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <Button variant="secondary">Contact Us</Button>
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                        <li>
                            <a href="#" className="block py-2 px-3 rounded-sm md:p-0" aria-current="page" style={{
                                color: COLORS.text
                            }}>Home</a>
                        </li>
                        <li>
                            <a href="#TEST_DETAILS_PANE" className="block py-2 px-3 rounded-sm md:p-0" style={{
                                color: COLORS.secondary,
                            }} onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.secondary)}>Test Details</a>
                        </li>
                        <li>
                            <a href="#TERMINAL" className="block py-2 px-3 rounded-sm md:p-0" style={{
                                color: COLORS.secondary,
                            }} onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.secondary)}>Shell Logs</a>
                        </li>
                        <li>
                            <a href="#DASHBOARD" className="block py-2 px-3 rounded-sm md:p-0" style={{
                                color: COLORS.secondary,
                            }} onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.secondary)}>Dashboard</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar01;