import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"

import { useState,useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"

import {useNavigate} from "react-router-dom"
import { toast } from "sonner"



export function TabsDemo() {

    const[signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });


    const[loginInput, setLoginInput]= useState({
        email:"",
        password:""
    });



    const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();



  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();




    const changeInputHandler =(e,type)=>{
        const {name,value}=e.target
        if(type==="signup"){
            setSignupInput({...signupInput,[name]:value})
        }
        else {
            setLoginInput({...loginInput,[name]:value})
        }
    };



     const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        await action(inputData);
    };


    // const navigate = useNavigate();


      useEffect(() => {
        if(registerIsSuccess && registerData){
          toast.success(registerData.message || "Signup successful.")
          // navigate("/");
        }
        if (registerError) {
          toast.error(registerError?.data?.message || registerError?.message || "Signup Failed");
        }
        if(loginIsSuccess && loginData){
          toast.success(loginData.message || "Login successful.");
          // navigate("/");
        }
        if (loginError) {
          toast.error(loginError?.data?.message || loginError?.message || "Login Failed");
        }

      }, [
        loginIsLoading,
        registerIsLoading,
        loginData,
        registerData,
        loginError,
        registerError,
      ]);

    

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="Login" className="w-[400px]">

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Signup">Signup</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="Signup">
          <Card>

            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-">

              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Priyanshu"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="text"
                  id="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. priya@gmail.com"
                  required
                  />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input 
                  type="password"
                  id="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. xyz@123"
                  required
                  />
              </div>
              
            </CardContent>


            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait..
                  </>
                ) : ("Signup")}
              </Button>

            </CardFooter>
          </Card>
        </TabsContent>


        <TabsContent value="Login">

          <Card>

            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. priya@gmail.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. xyz@123"
                  required
                />
              </div>
              
            </CardContent>


            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait..
                  </>
                ) : ("Login")}
              </Button>
            </CardFooter>


          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
export default function Login() {
  return (
    <div className="flex items-center w-full justify-center mt-20">
      <TabsDemo />
    </div>
  )
}