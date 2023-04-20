import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const [question, setQuestion] = useState<string>("");
  const [generatedAnswer, setGeneratedAnswer] = useState<string>("");

  const houseMutation = api.house.searchHouse.useMutation();

  const bioRef = useRef<null | HTMLDivElement>(null);

  console.log("houseMutation", houseMutation.data);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getHouseData = async () => {
    await houseMutation.mutateAsync({ stAddress: address });
  };

  const generateAnswer = async () => {
    setGeneratedAnswer("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        house: !!houseMutation.data ? JSON.stringify(houseMutation.data) : null,
        question,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue: string = decoder.decode(value);
      setGeneratedAnswer((prev: string) => {
        return prev + chunkValue;
      });
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Head>
        <title>Home Mentor: Your AI Real Estate Assistant</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
        <h1 className="max-w-[708px] text-4xl font-bold text-slate-900 sm:text-6xl">
          Your AI powered real estate assistant.
        </h1>
        <p className="mt-5 text-slate-500">
          69,420 recommendations given so far.
        </p>
        <div className="w-full max-w-xl">
          <div className="mt-10 flex items-center space-x-3">
            <Image
              src="/1.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter address of an active listing{" "}
              <span className="text-slate-500">
                (we will get all the data on it)
              </span>
              .
            </p>
          </div>
          {!houseMutation.data ? (
            <>
              {houseMutation.error && (
                <p className="my-2 text-red-700">
                  Could not find listing, please try again.
                </p>
              )}
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={houseMutation.isLoading}
                className="my-5 w-full rounded-md border border-gray-800 px-4 py-2 shadow-sm focus:border-black focus:ring-black"
                placeholder={"12345 Main Street, Los Angeles CA 92591"}
              />
              {houseMutation.isLoading && (
                <div className="flex h-28 items-center justify-center ">
                  <div className="grid gap-2">
                    <div className="flex animate-pulse items-center justify-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                    </div>
                  </div>
                </div>
              )}
              <button
                className="mt-4 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
                onClick={() => {
                  void getHouseData();
                }}
                disabled={houseMutation.isLoading}
              >
                Load listing
              </button>
            </>
          ) : (
            <div className="my-8">
              <div className="my-2 flex items-center justify-center">
                <h2 className="mr-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Listing found!
                </h2>
                <Image
                  alt="checkmark"
                  src="/check.svg"
                  width={24}
                  height={24}
                />
              </div>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                <div className="rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                  <h4 className="italic">Listing:</h4>
                  <p>{`${houseMutation.data.address.line}, ${houseMutation.data.address.city} ${houseMutation.data.address.postal_code}`}</p>
                </div>
              </div>
            </div>
          )}
          {houseMutation.data && (
            <>
              <div className="my-5 flex items-center space-x-3">
                <Image src="/2.png" width={30} height={30} alt="1 icon" />
                <p className="text-left font-medium">
                  How can I help you with this listing?
                </p>
              </div>
              <textarea
                className="my-5 w-full rounded-md border border-gray-800 px-4 py-2 shadow-sm focus:border-black focus:ring-black"
                placeholder={"Example: Would this house be good for a family?"}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
                onClick={() => {
                  void generateAnswer();
                }}
                disabled={loading}
              >
                Ask your question &rarr;
              </button>
            </>
          )}
          {loading && (
            <button
              className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <hr className="border-1 h-px bg-gray-700 dark:bg-gray-700" />
        <div className="my-10 space-y-10">
          {generatedAnswer && (
            <>
              <div>
                <h2
                  className="mx-auto text-3xl font-bold text-slate-900 sm:text-4xl"
                  ref={bioRef}
                >
                  Your answer
                </h2>
              </div>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                <div className="cursor-copy rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                  <p>{generatedAnswer}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
