import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/EmptyState";

describe("EmptyState", () => {
  it("renders clear empty state copy", () => {
    render(<EmptyState />);

    expect(screen.getByText("No tasks")).toBeInTheDocument();
    expect(screen.getByText("Create a task or change the category filter.")).toBeInTheDocument();
  });
});
