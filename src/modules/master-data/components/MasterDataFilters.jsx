import { Segmented } from "antd";

import { MASTER_DATA_FILTER_OPTIONS } from "../constants/masterData.constants";

export default function MasterDataFilters({ type, setType }) {
  return (
    <Segmented
      block
      value={type}
      options={MASTER_DATA_FILTER_OPTIONS}
      onChange={setType}
      style={{
        marginBottom: 20,
      }}
    />
  );
}
