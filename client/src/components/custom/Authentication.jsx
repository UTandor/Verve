import Login from "./authentication/Login";
import Register from "./authentication/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Authentication = ({ changeCurrentPage }) => {
  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <Tabs defaultValue="register" className="w-full">
        <div className="flex items-center justify-center  ">
          <TabsList className="grid grid-cols-2   ">
            <TabsTrigger className="px-[4.25rem]" value="register">
              Register
            </TabsTrigger>
            <TabsTrigger className="px-[4.25rem]" value="login">
              Login
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="register"
          className="w-full flex justify-center mx-auto"
        >
          <Register changeCurrentPage={changeCurrentPage} />
        </TabsContent>
        <TabsContent
          value="login"
          className="w-full flex justify-center mx-auto"
        >
          <Login changeCurrentPage={changeCurrentPage} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Authentication;
