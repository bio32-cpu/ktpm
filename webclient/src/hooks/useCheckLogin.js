import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { path } from '../ultils/containts';

const useCheckLogin = () => {
    const { isLoggedIn, active } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn) {
            navigate(path.LOGIN)
        } else {
            navigate(active)
        }
    }, [isLoggedIn]);
};

export default useCheckLogin;