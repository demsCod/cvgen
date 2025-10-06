import { Link } from 'react-router-dom';
const Navbar: React.FC<{ activeMenu: 'home' | 'profile' | 'settings' }> = ({ activeMenu }) => {
    return (
    <div className='h-16    flex items-center px-4'>
                <Link
                    to="/"
                    className="text-lg font-bold text-indigo-700 leading-relaxed"
                >
                    CVGen
                </Link>
    </div>
    );
};

export default Navbar;