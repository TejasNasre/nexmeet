"use client";
import React, { useEffect,useState} from "react";
import { userDetails } from "../../action/userDetails";

function Page() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetails().then((res : any) => {
      setUser(res);
      setLoading(false);
      console.log(user);
    });
  }, []);

  return (
    <div>
      <h1>User Details</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {user.map((item: any) => (
            <div key={item.id}>
              <h1>{item.given_name}</h1>
              <h1>{item.family_name}</h1>
              <h1>{item.email}</h1>
            </div>
          ) )}
        </>
      )}
    </div>
  );
}

export default Page;
