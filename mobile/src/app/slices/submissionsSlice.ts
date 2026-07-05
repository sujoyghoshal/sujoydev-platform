import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectRequest, BugReport } from '../../types';

interface SubmissionsState {
  requests: ProjectRequest[];
  bugs: BugReport[];
}

const initialState: SubmissionsState = { requests: [], bugs: [] };

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    requestAdded(state, action: PayloadAction<ProjectRequest>) {
      state.requests.unshift(action.payload);
    },
    bugAdded(state, action: PayloadAction<BugReport>) {
      state.bugs.unshift(action.payload);
    },
    submissionSynced(
      state,
      action: PayloadAction<{ kind: 'request' | 'bug'; id: string }>,
    ) {
      const { kind, id } = action.payload;
      const item =
        kind === 'request'
          ? state.requests.find((r) => r.id === id)
          : state.bugs.find((b) => b.id === id);
      if (item) {
        item.synced = true;
      }
    },
    hydrateSubmissions(_state, action: PayloadAction<SubmissionsState>) {
      return action.payload;
    },
  },
});

export const { requestAdded, bugAdded, submissionSynced, hydrateSubmissions } =
  submissionsSlice.actions;
export default submissionsSlice.reducer;
