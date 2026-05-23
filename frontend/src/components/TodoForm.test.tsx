import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "@/components/TodoForm";

const categories = [
  {
    id: 1,
    name: "Work",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("TodoForm", () => {
  it("submits todo text and category", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);

    render(<TodoForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Task"), "Write tests");
    await user.click(screen.getByLabelText("Category"));
    await user.click(screen.getByRole("option", { name: "Work" }));
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onSubmit).toHaveBeenCalledWith({
      text: "Write tests",
      categoryId: "1"
    });
  });
});
