import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Login, ForgotPass, Main, Profile, Employee, Department, Home, Account, Salary, SalaryTax } from "./pages";
import { path } from "./ultils/containts";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { checkTokenExpired } from "./services";
import * as actions from "./store/actions"
import { Spinner } from "./components";

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useSelector(state => state.auth);
  const type = token ? jwtDecode(token)?.type : 0;
  const navigator = useNavigate()
  const dispatch = useDispatch()

  const checkToken = async () => {
    try {
      const rs = await checkTokenExpired({ token: token });
      if (rs.status === 200 && rs.data.isExpired) {
        dispatch(actions.logout());
        return;
      }
      if (rs.status >= 400 && rs.status <= 500) {
        navigator(path.LOGIN);
        return;
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkToken()
  }, [token])

  return (
    <div>
      <Spinner
        isOpen={isLoading}
        onClose={() => setIsLoading(false)}
        message="Loading....."
      />
      <Routes>
        <Route exact path={path.LOGIN} element={<Login />} />
        <Route path={path.MAIN} element={token ? <Main /> : <Navigate to={path.LOGIN} />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PROFILE} element={<Profile />} />
          <Route path={path.TAX} element={<SalaryTax />} />
          <Route path={path.ACCOUNT} element={type === 2 ? <Account /> : <Home />} />
          <Route path={path.EMPLOYEE} element={type !== 0 ? <Employee /> : <Home />} />
          <Route path={path.DEPARTMENT} element={type === 2 ? <Department /> : <Home />} />
          <Route path={path.SALARY} element={type !== 0 ? <Salary /> : <Home />} />
          <Route path={path.STAR} element={<Home />} />
        </Route>
        <Route path={path.FORGOTPASS} element={<ForgotPass />} />
        <Route path={path.STAR} element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;