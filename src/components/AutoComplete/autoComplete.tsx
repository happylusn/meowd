import React, { FC, useState, ChangeEvent, ReactElement, useEffect, KeyboardEvent, useRef } from 'react';
import classNames from 'classnames';
import Input, { InputProps } from '../Input/input';
import Icon from '../Icon/icon';
import Transition from '../Transition/transition';
import useDebounce from '../../hooks/useDebounce';
import useClickOutside from '../../hooks/useClickOutside';

interface DataSourceObject {
  value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
  onSelect?: (item: DataSourceType) => void;
  renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {fetchSuggestions, onSelect, value, renderOption, ...restProps} = props;
  const [inputValue, setInputValue] = useState(value as string);
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [ highlightIndex, setHighlightIndex] = useState(-1);

  const triggerSearch = useRef(false);
  const componentRef = useRef<HTMLDivElement>(null);
  useClickOutside(componentRef, () => { setSuggestions([]);});
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedValue !== '' && debouncedValue !== undefined && triggerSearch.current) {
      const results = fetchSuggestions(debouncedValue);
      if (results instanceof Promise) {
        setLoading(true);
        results.then(data => {
          setLoading(false);
          setSuggestions(data);
        });
      } else {
        setSuggestions(results);
      }
    } else {
      setSuggestions([]);
    }
  }, [debouncedValue, fetchSuggestions]);
  const highlight = (index: number) => {
    if (index < 0) index = suggestions.length - 1;
    if (index >= suggestions.length) {
      index = 0;
    }
    setHighlightIndex(index);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
    case 13: // 回车键
      if (suggestions[highlightIndex]) {
        handleSelect(suggestions[highlightIndex]);
      }
      break;
    case 38: // up键
      highlight(highlightIndex - 1);
      break;
    case 40: // down键
      highlight(highlightIndex + 1);
      break;
    case 27: // esc键
      setSuggestions([]);
      break;
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    triggerSearch.current = true;
  };
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value);
    setSuggestions([]);
    if (onSelect) { 
      onSelect(item);
    }
    triggerSearch.current = false;
  };
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  };
  const generateDropdown = () => {
    return (
      <Transition
        in={!!suggestions.length || loading}
        timeout={300}
        animation="zoom-in-top"
        unmountOnExit={true}
        onExited={() => setSuggestions([])}
      >
        <ul className="meow-suggestion-list">
          {
            loading && <li className="meow-suggestion-loading"><Icon icon="spinner" spin/></li>
          }
          {
            suggestions.map((item, index) => {
              const cnames = classNames('meow-suggestion-item', {
                'meow-suggestion-item-focus': index === highlightIndex
              });
              return (
                <li key={index} className={cnames} onClick={() => handleSelect(item)}>
                  {renderTemplate(item)}
                </li>
              );
            })
          }
        </ul>
      </Transition>
    );
  };
  return (
    <div className="meow-auto-complete" ref={componentRef}>
      <Input value={inputValue} {...restProps} onChange={handleChange} onKeyDown={handleKeyDown}/>
      {generateDropdown()} 
    </div>
  );
};

export default AutoComplete;
