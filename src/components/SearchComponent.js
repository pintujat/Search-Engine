import React, { useState, useEffect } from 'react'
import ErrorComponent from './ErrorComponent'


function SearchComponent() {

    // Store current search term
    const [searchValue, setSearchValue] = useState("");

    //Store temperory search result to display in search corpus area
    const [tempResult, setTempResult] = useState([]);

    //Store words that should be removed from search corpus area
    const [removeValue, setRemoveValue] = useState([]);

    //Store final search result to display to the user
    const [finalResult, setFinalResult] = useState([]);

    //Store true or false to display error to the user
    const [isError, setIsError] = useState(false);



    // Handle input changes
    const handleSearchInputChanges = (e) => {
        setSearchValue(e.target.value);
    }

    // Resets the input field 
    const resetInputField = () => {
        setSearchValue("");
    }


    //Runs on clicking the search button or pressing enter
    const callSearchFunction = (e) => {
        e.preventDefault();
        if (searchValue) {
            setFinalResult(tempResult);
            setIsError(false);
            setTempResult([]);
            resetInputField();
        }
        else
            setIsError(true);
    }





    // Fetch search result from search api using GET Request
    const callSearchAPI = () => {
        if (searchValue) {
            fetch("http://localhost:9000/search?search=" + searchValue)
                .then(res => res.json())
                .then((res) => {
                    if (res.status === 'ok') {
                        var newList = (res.matchList).filter(item => !removeValue.includes(item));
                        setTempResult(newList)
                    }
                    else {
                        setTempResult(["No Result Found"]);
                    }
                });
        }
    }

    useEffect(() => {
        if (searchValue && /\S/.test(searchValue)) {
            setIsError(false);
            callSearchAPI();
        }
        else
            setTempResult([])
    }, [searchValue])


    useEffect(() => {
        if (removeValue)
            callSearchAPI();
        else
            setTempResult([])
    }, [removeValue])


    return (
        <section id='search-section'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 mx-auto'>
                        <div className='row'>
                            <div className='col-12'>

                                {/* Result display section */}
                                <div className='search-result-div my-5'>
                                    <div className='row'>
                                        {
                                            finalResult.map((res, i) => {
                                                if (res !== 'No Result Found') {
                                                    return (
                                                        <div key={i} className='col-4 col-md-3 col-lg-3 '>
                                                            <li key={i} >
                                                                {res}
                                                            </li>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }


                                    </div>
                                </div>

                            </div>
                            <div className='col-12'>
                                <h2>WHAT ARE YOU LOOKING FOR?</h2>
                            </div>
                            {/* Error display section */}
                            <div className='col-12 error-div'>
                                <ErrorComponent isError={isError}></ErrorComponent>
                            </div>
                            {/* Search Bar Input section */}
                            <div className='col-12 col-sm-12 col-md-8 col-lg-6 mx-auto ' style={{ minHeight: '50vh' }}>
                                <div id="search_bo" className="search-input">
                                    <form className='row'>
                                        <div className='col-10 pr-0'>
                                            <input type="text" id="search_term" value={searchValue} onKeyDown={handleSearchInputChanges} onChange={handleSearchInputChanges} name="search_term" placeholder="Enter Search" ></input>
                                        </div>
                                        <div className='col-2 pl-0 '>
                                            <button id='submit-btn' type="submit" onClick={callSearchFunction} name="search" value="SEARCH"><i className="fas fa-search"></i></button>
                                        </div>
                                    </form>
                                    {/* Display 3 most matched words section */}
                                    <div className="autocom-box">
                                        {
                                            tempResult.slice(0, 3).map((res, i) => {
                                                return (
                                                    <div key={i} className='search-suggestion-div'>
                                                        <li onClick={() => { if (res !== 'No Result Found') setSearchValue(res) }} style={{ color: 'black' }}>{res}</li>
                                                        <i onClick={() => { if (res !== 'No Result Found') setRemoveValue([...removeValue, res]); }} className="fa fa-times"></i>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </section >
    )
}

export default SearchComponent
