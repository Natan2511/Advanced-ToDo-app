import styled from "styled-components";
import { motion } from "framer-motion";

// Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

// Card
export const Card = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  transition: all var(--transition-normal);
  margin-bottom: 1rem;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

// Button
export const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
`;

// Button variants
export const PrimaryButton = styled(Button)`
  background: var(--primary-500);
  color: white;

  &:hover:not(:disabled) {
    background: var(--primary-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(Button)`
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--primary-300);
  }
`;

export const GhostButton = styled(Button)`
  background: transparent;
  color: var(--text-secondary);

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;

export const DangerButton = styled(Button)`
  background: var(--danger-500);
  color: white;

  &:hover:not(:disabled) {
    background: var(--danger-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

// Input
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  }

  &:hover {
    border-color: var(--primary-300);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Badge
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PrimaryBadge = styled(Badge)`
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
`;

export const SuccessBadge = styled(Badge)`
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-600);
`;

export const WarningBadge = styled(Badge)`
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-600);
`;

export const DangerBadge = styled(Badge)`
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-600);
`;

// Modal
export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
`;

// Flex utilities
export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.$align || "center"};
  justify-content: ${(props) => props.$justify || "flex-start"};
  gap: ${(props) => props.$gap || "0"};
  flex-direction: ${(props) => props.$direction || "row"};
  flex-wrap: ${(props) => props.$wrap || "nowrap"};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns || "1fr"};
  gap: ${(props) => props.$gap || "1rem"};
  align-items: ${(props) => props.$align || "start"};
`;

// Text utilities
export const Text = styled.span`
  color: ${(props) => props.$color || "var(--text-primary)"};
  font-size: ${(props) => props.$size || "1rem"};
  font-weight: ${(props) => props.$weight || "400"};
  line-height: ${(props) => props.$lineHeight || "1.5"};
`;

export const Heading = styled.h1`
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.2;
  margin: 0;

  ${(props) =>
    props.level === 1 &&
    `
    font-size: 2.25rem;
  `}

  ${(props) =>
    props.level === 2 &&
    `
    font-size: 1.875rem;
  `}
  
  ${(props) =>
    props.level === 3 &&
    `
    font-size: 1.5rem;
  `}
  
  ${(props) =>
    props.level === 4 &&
    `
    font-size: 1.25rem;
  `}
`;

// Spacing utilities
export const Spacer = styled.div`
  height: ${(props) => props.height || "1rem"};
  width: ${(props) => props.width || "auto"};
`;

// Loading states
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

// Responsive utilities
export const HideOnMobile = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ShowOnMobile = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

// App specific components
export const AppWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: background-color var(--transition-normal);
`;

export const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.125rem;
    color: var(--text-secondary);
  }
`;

export const KeyboardHelp = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 10;
  max-width: 200px;

  div {
    padding: 0.25rem 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: var(--shadow-sm);
    font-size: 0.7rem;
    white-space: nowrap;
  }
`;

// Header components
export const HeaderWrapper = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(var(--bg-primary-rgb), 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
`;

export const Logo = styled(Flex)`
  align-items: center;
  gap: 0.75rem;

  > div:first-child {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: white;
      font-weight: 700;
      font-size: 1.125rem;
    }
  }

  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }
`;

export const Controls = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProgressBar = styled(motion.div)`
  margin-top: 1rem;
`;

// Checkbox styles
export const Checkbox = styled(motion.button)`
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  background: var(--bg-primary);

  &:hover {
    border-color: var(--primary-500);
    background: var(--primary-50);
  }

  &.completed {
    background: var(--success-500);
    border-color: var(--success-500);
    color: white;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;
