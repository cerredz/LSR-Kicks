import React, {useState} from 'react';
import { FAQ__Data } from './Questions';
import { AiOutlineCaretDown } from "react-icons/ai"
import "./FAQ.css";

//aos animation library
import Aos from "aos";
import "aos/dist/aos.css";

const FAQ = (props) => {

    const [faqData, setFaqData] = useState(FAQ__Data);
    const [selectedSection, setSelectedSection] = useState("General");
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    
    //function to add functionability to the section header at the top of the page
    const handleSectionClick = (section) => {

        //change the color of the font and make it underlined
        setSelectedSection(section);

        //scroll to the section selected
        const sectionHeader = document.getElementById(section)

        if(sectionHeader) {
            const coordinates = sectionHeader.offsetTop;
            window.scrollTo({top: coordinates + 500, behavior: 'smooth'});
        }

    }

    //function to toggle a question on/off
    const handleToggleQuestion = (question) => {

        //get the current selected questions
        const questionsSelected = [...selectedQuestions];

        //if not selected
        if(!questionsSelected.includes(question.question__number)) {
            
            //add it to questions selected
            questionsSelected.push(question.question__number);
            setSelectedQuestions(questionsSelected)

        //if already selected
        } else {
            
            //filter it our of the selected questions
            const removedQuestion = questionsSelected.filter((q) => q !== question.question__number);
            setSelectedQuestions(removedQuestion);
        }


    }

    return (
    <div className='faq-container'>
        <div className="faq-content">
            <div className="faq-title">
                <span data-aos="fade-left" className="header-text">Frequently Asked Questions</span>
                <h3 data-aos="zoom-in-up" className="subheader-text">
                        At LSR Kicks, we strive to provide you with the 
                        best possible shoe buying
                        experience. We understand that answering your 
                        questions is an key part of that goal. 
                        Explore our comprehensive FAQ section, 
                        where we address common inquiries, and provide you with 
                        detailed responses that are aimed at giving you the 
                        information you need for a reliable and satisfying 
                        shopping experience.
                </h3>

                
            </div>

           
            <div className="faq-sections">
                <div data-aos="fade-left" className="faq-sections-header flex">
                    {faqData.map((section, index) => (
                        <h1 
                         key={index}
                        className={`subheader-text ${selectedSection === section.section ? "subheader-active" : ""}`} 
                        onClick={() => handleSectionClick(section.section) }> {section.section}</h1>
                    ))}
                    
                </div>
                <hr />

                <div  className="faq-sections-content">
                    {faqData.map((section, index) => (
                        <section key={index} data-aos="zoom-in-up" id={section.section} >
                          <h1 id={section.section} className="title-text">{section.section}</h1>  
                            <br />
                            {section.QuestionsAndAnswers.map((question, index) => (
                                <div key={index} className="question-card">
                                    <React.Fragment key={index} >
                                        <div className={`question flex ${selectedQuestions.includes(question.question__number) ? "up" : "down"}`}>
                                            <h1 className={`subheader-text ${selectedQuestions.includes(question.question__number) ? "active" : ""}`}> {question.question} </h1>
                                            <AiOutlineCaretDown onClick={() => handleToggleQuestion(question)}/>
                                        </div>

                                        <div className={`answer ${selectedQuestions.includes(question.question__number) ? "display-question" : "hide-question"}`}>
                                            <p className="paragraph-text" dangerouslySetInnerHTML={{__html: question.answer}}></p>

                                        </div>
                                        <hr />
                                    </React.Fragment>
                                </div>
                            ))}
                            
                        </section>
                    ))}

                </div>

                <h3 data-aos="fade-right" className="closing-text">* If you still have any questions, please make sure to contact our <a href="/contact">customer support</a> *</h3>
            </div>
        </div>
        
        
    </div>
  )
}

export default FAQ