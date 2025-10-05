import { Link } from 'react-router-dom';
const Navbar: React.FC<{ activeMenu: 'home' | 'profile' | 'settings' }> = ({ activeMenu }) => {
    return (
    <div className='h-16 bg-white  border border-b shadow-sm flex items-center px-4'>
                <Link to="/" className="text-lg font-bold">CVGen</Link>
    </div>
    );
};

export default Navbar;