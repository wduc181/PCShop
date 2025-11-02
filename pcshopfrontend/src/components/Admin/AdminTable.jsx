import React from "react";
import { Button } from "@/components/ui/button";

const AdminTable = ({ columns, data, onEdit, onDelete, renderActions, actionHeader = "Actions" }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full border-collapse">
        <thead className="bg-gray-200 text-left">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-3 border-b">{col}</th>
            ))}
            <th className="p-3 border-b text-center">{actionHeader}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {Object.values(item).map((val, jdx) => (
                <td key={jdx} className="p-3 border-b">{val}</td>
              ))}
              <td className="p-3 border-b text-center">
                {typeof renderActions === "function" ? (
                  renderActions(item)
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(item.id)}>
                      Sửa
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                      Xóa
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
