import React, { Component, Fragment } from "react";

class Search extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: '',
      // backend url
      searchURL : 'http://localhost:5001/search?query='
    };
    this.itemRefs = {};
    
  }
 
   getInfo = (userInput) => {
        const {searchURL} = this.state
        fetch(searchURL+userInput).then((res) => res.json()).then((json) => {
                          this.setState({
                            filteredSuggestions: json,
                            showSuggestions: true
                          });
                      })
  
      }
  onChange = e => {
    // const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
   
    // Filter our suggestions that don't contain the user's input
    if(userInput && userInput.length > 1){
       this.getInfo(userInput)
      this.setState({
        activeSuggestion: 0,
        userInput: e.currentTarget.value
      });
    }else{
      this.setState({
        activeSuggestion: 0,
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }
    
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;
   
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: JSON.stringify(filteredSuggestions[activeSuggestion])
      })
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }  
      if(activeSuggestion > 0){
        this.setState({ activeSuggestion: activeSuggestion - 1 });
        this.itemRefs[activeSuggestion - 1].scrollIntoView();
      }
    }

    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      if(activeSuggestion < filteredSuggestions.length-1){
        this.itemRefs[activeSuggestion + 1].scrollIntoView();
        this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
    }
    
  };
  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className = null;let idTextClass= null;

              // Flag the active suggestion with a class
            
                
              if (index === activeSuggestion) {
             
                className = "suggestion-active";
                idTextClass="id-text"
              }
            
              return (
                <li  class={className} id={index} key={index} onClick={onClick}  ref={el => (this.itemRefs[index] = el)}>
                  
                  <p class={idTextClass}>{suggestion._id}</p><p>{suggestion.name} </p><p>{suggestion.address}</p>
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          
          <ul class="suggestions">
          <p class="no-value">No User Found</p>
        </ul>
        );
      }
    }

    return (
      <Fragment>
     
       <div class="input-icons">
       <i className="fa fa-search" aria-hidden="true"></i>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          
       />
       </div>
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Search;