import React from 'react';


export default function Tabs({children}){
    const [activeTab, setActiveTab] = React.useState(children[0].props.label);

    function onClickTab(tab){
        setActiveTab(tab)
    }
    return(
        <div className="tabs">
        <div className="tab-list">
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                label={label}
                key={label}
                onClick={onClickTab}
              />
            );
          })}
        </div>
        <div className="tab-content">
          {children.map((child) => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    )
} 

function Tab({label,activeTab,onClick}){
    function onClickTab(){
      onClick(label);
    }
    
    let className = 'tab-list-item';

    if (activeTab === label){
      className += ' tab-list-active';
    }

    return(
      <li
        className={className}
        onClick={onClickTab}
      >
        {label}
      </li>
    )
}

