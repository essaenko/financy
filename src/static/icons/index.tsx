import React from 'react';

import { IconStyleList, ReactIcon } from 'static/icons/react.icon';

import PieChartImage from './pie-chart.png';
import CancelImage from './cancel.png';
import CategoriesImage from './categories.png';
import ChevronDownImage from './chevron-down.png';
import ChevronUpImage from './chevron-up.png';
import ChevronLeftImage from './chevron-left.png';
import ChevronRightImage from './chevron-right.png';
import CreditCardImage from './credit-card.png';
import ListImage from './list.png';
import LogoutImage from './logout.png';
import PlusImage from './plus.png';
import ReloadImage from './reload.png';
import UserImage from './user.png';
import FilterImage from './filter.png';

type Props = {
  className?: string;
  onClick?: () => void;
  style?: IconStyleList;
};

export const PieChartIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={PieChartImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const CancelIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={CancelImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const CategoriesIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={CategoriesImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ChevronDownIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ChevronDownImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ChevronUpIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ChevronUpImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ChevronLeftIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ChevronLeftImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ChevronRightIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ChevronRightImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const CreditCardIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={CreditCardImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ListIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ListImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const LogoutIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={LogoutImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const PlusIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={PlusImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const ReloadIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={ReloadImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const UserIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={UserImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);

export const FilterIcon = ({ className, onClick, style }: Props) => (
  <ReactIcon
    icon={FilterImage}
    className={className}
    onClick={onClick}
    style={style}
  />
);
