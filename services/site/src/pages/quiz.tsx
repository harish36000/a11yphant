import ButtonLoading from "app/components/buttons/ButtonLoading";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import React, { useState } from "react";

const Quiz: React.FunctionComponent = () => {
  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);

  //   const {
  //     // setLevelId,
  //     // submissionId,
  //     // setSubmissionId,
  //     // setSubmissionCode,
  //     // submissionCode,
  //     // updateSubmission,
  //     loading: autoSaveLoading,
  //   } = useSubmissionAutoSave();

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);

    // await updateSubmission();

    // await requestCheckMutation({
    //   variables: { requestCheckInput: { submissionId } },
    // });

    // router.push(`${router.asPath}/evaluation/${submissionId}`);
  };

  const mockAnswers = [
    {
      id: "1",
      text: "This tag does not exist in the HTML specification.",
    },
    {
      id: "2",
      text: "It contains meta information regarding the page, for example the title.",
    },
    {
      id: "3",
      text: "It contains the content of the page.",
    },
    {
      id: "4",
      text: "This tag should contain the website's logo.",
    },
  ];

  return (
    <>
      <Head>
        {/* TODO: activate title */}
        <title>{/* {challenge.name} - Level {nthLevel} */}</title>
      </Head>
      <Navigation displayBreadcrumbs>
        {/* TODO: display autosave */}
        {/* <Transition
          show={autoSaveLoading}
          enter="transition-opacity duration-300"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 delay-1000"
          leaveTo="opacity-0"
        >
          <span>
            Saving... <LoadingIndicator className="inline ml-4" />
          </span>
        </Transition> */}
      </Navigation>
      <main className={clsx("h-main box-border mx-auto p-4")}>
        <SmallScreenNotification />
        <section
          className={clsx("mx-auto h-full w-full box-border hidden", "container-dark", "lg:px-12 lg:pt-12 lg:flex lg:flex-col lg:justify-between")}
        >
          <h2 className={clsx("mb-2", "h5")}>Quiz</h2>
          <div className={clsx("grid grid-cols-7")}>
            {/* TODO:: dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} */}
            <h3 className={clsx("h2 leading-tight tracking-wider font-mono col-span-4 mr-8", "prose")}>What is the purpose of the head tag?</h3>
            <div className={clsx("col-span-3")}>
              <SingleAnswer srTitle={"Possible answers to the quiz"} answers={mockAnswers} />
            </div>
          </div>
          {/* TODO: disable button when no answer is selected */}
          <div className="flex justify-end mr-[-3rem]">
            <ButtonLoading
              primary
              onClick={submitLevel}
              className="px-10 absolute right-0 bottom-0"
              loading={showSubmitLoadingAnimation}
              submitButton
              srTextLoading="The submission is being processed."
            >
              Submit
            </ButtonLoading>
          </div>
        </section>
      </main>
    </>
  );
};

export default Quiz;
