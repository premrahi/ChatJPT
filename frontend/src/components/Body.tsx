import React from "react";

const Body = () => {
  return (
    <div className=" text-white overflow-x-hidden">
      <div className="container mx-auto my-20 max-w-3xl  pb-32">
        {/* this section will store message of the chatbot */}

        {/* user messages */}
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>
        <div className="bg-red-900 p-3 ml-auto max-w-fit rounded-xl my-4">
          <h4> hi, how are you? </h4>
        </div>

        {/* assistant response */}
        <div className=" max-w-fit ">
          <h4>i'm fine , how are you?</h4>
        </div>

        {/* input textarea */}

        
      </div>
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center " style={{background: "#360800"}} >
          <div className="bg-red-950 rounded-2xl w-full p-4 max-w-3xl mb-5">
            <textarea
              className="w-full resize-none outline-0 "
              rows={2}
              placeholder="Hi, how can i help you?"
            />
            <div className="flex  justify-end">
              <button className="bg-red-900/90 hover:bg-amber-300 p-3 rounded-xl">
                {" "}
                ASk
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Body;
